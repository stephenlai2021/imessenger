import { reactive, watchEffect } from "vue";
import { auth, db } from "src/boot/firebase";
import router from "../router";

const state = reactive({
  users: [],
  messages: [],
  errorMessage: "",
  successMessage: "",
  userDetails: {},
  online: false,
  today: null,
  leftDrawerOpen: false,
  typing: false,
  avatar: null,
});

const methods = {
  handleAuthStateChanged() {
    console.log("handle auth state change | store");
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(`${user.uid} is logged in`);
        db.collection("chat-users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            state.userDetails = { ...doc.data(), userId: doc.id };
            console.log("user details | store", state.userDetails);
            db.collection("chat-users")
              .doc(user.uid)
              .update({ online: true })
              .then(() => {
                state.online = true;
                router.push("/");
              });
          })
          .catch((err) => {
            console.log("error message: ", err.message);
          });
      }
      if (!user) {
        console.log("there is no user | auth state change");
        state.userDetails = {};
        state.online = false;
        router.push("/auth");
      }
    });
  },
  registerUser(data) {
    auth
      .createUserWithEmailAndPassword(data.email, data.password)
      .then((cred) => {
        const user = cred.user;
        console.log("user: ", user);
        db.collection("chat-users").doc(user.uid).set({
          name: data.name,
          email: data.email,
          online: true,
        });
      })
      .catch((err) => {
        console.log("err message: ", err.message);
        state.errorMessage = err.message;
      });
  },
  loginUser(data) {
    auth
      .signInWithEmailAndPassword(data.email, data.password)
      .then((cred) => {
        const user = cred.user;
        console.log("user: ", user);
      })
      .catch((err) => {
        console.log("err message: ", err.message);
        state.errorMessage = err.message;
      });
  },
  logoutUser() {
    auth.signOut().then(() => {
      db.collection("chat-users")
        .doc(state.userDetails.userId)
        .update({ online: false })
        .then(() => {
          console.log("user is offline");
        });

      // console.log("user logged out");
      // state.userDetails = {};
    });
  },
  getMessages(from, to) {
    const unsub = db.collection("chat-messages")
      .doc(from)
      .collection(to)
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) => {
        console.log('snapshot: getMessages')
        state.messages = snapshot.docs.map((doc) => {
          return doc.data()
        });

        // state.messages.length = 0;
        // snapshot.docs.forEach((doc) => {
        //   state.messages.push({ ...doc.data() });
        // });
      });
    
     watchEffect((onInvalidate) => {
       // unsub from prev collection when watcher is stopped (component unmounted)
       onInvalidate(() => unsub());
     });
  },
  sendMessage(data) {
    let from = state.userDetails.name;

    db.collection("chat-messages").doc(from).collection(data.to).add({
      from: "me",
      text: data.text,
      createdAt: data.createdAt,
    });

    db.collection("chat-messages").doc(data.to).collection(from).add({
      from: "them",
      text: data.text,
      createdAt: data.createdAt,
    });
  },
  getUsers() {
    const unsub = db.collection("chat-users").onSnapshot((snap) => {
      console.log('snapshot: getUsers')
      state.users = snap.docs.map((doc) => {
        return { ...doc.data(), userId: doc.id };
      });
    });

    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub());
    });
  },
  getOnlineStatus(id) {
    const unsub = db.collection("chat-users")
      .where("name", "==", id)
      .onSnapshot((snapshot) => {
        console.log("snapshot: getOnlineStatus");
        snapshot.docs.map((doc) => {
          state.online = doc.data().online;
          console.log("state: ", state.online);
        });
      });
    
    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub());
    });
  },
  getToday() {
    state.today = new Date().toLocaleString();
  },
};

const getters = {
  filteredUsers() {
    return state.users.filter((user) => {
      return user.userId !== state.userDetails.userId;
    });
  },
};

export default {
  state,
  methods,
  getters,
};
