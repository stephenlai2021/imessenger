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
  rightatDrawerOpen: false,
  typing: {
    from: null,
    typing: false,
  },
  avatar: null,
  user: {},
  dark: false,
  chinese: false,
  desktop: false,
  login: false,
  tab: "home",
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
                state.login = false;

                // if (router.currentRoute.value.fullPath.includes('/chat')) {                 
                //   router.push('/users')
                // }
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
        router.push("/");
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
        
        state.tab = 'home'
        router.push('/')
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
    });
  },
  getMessages(from, to) {
    const unsub = db
      .collection("chat-messages")
      .doc(from)
      .collection(to)
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) => {
        console.log("snapshot: getMessages");

        state.messages = snapshot.docs.map((doc) => {
          return doc.data();
        });

        // state.messages.length = 0;
        // snapshot.docs.forEach((doc) => {
        //   state.messages.push({ ...doc.data() });
        // });
      });

    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub());
    });
  },
  sendMessage(data) {
    let from = state.userDetails.name;

    db.collection("chat-messages")
      .doc(data.to)
      .collection(from)
      .doc("typing indicator")
      .update({
        typing: false,
      });

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
  sendTypingIndicator(data) {
    let from = state.userDetails.name;

    db.collection("chat-messages")
      .doc(from)
      .collection(data.to)
      .doc("typing indicator")
      .set({
        from: "me",
        typing: false,
      });

    db.collection("chat-messages")
      .doc(data.to)
      .collection(from)
      .doc("typing indicator")
      .set({
        from: "them",
        typing: true,
      });

    setTimeout(() => {
      db.collection("chat-messages")
        .doc(data.to)
        .collection(from)
        .doc("typing indicator")
        .update({
          typing: false,
        })
        .then(() => {
          state.typing.typing = false;
        });
    }, 1000);
  },
  getTypingIndicator(from, to) {
    const unsub = db
      .collection("chat-messages")
      .doc(from)
      .collection(to)
      .doc("typing indicator")
      .onSnapshot((doc) => {
        // state.typing = doc.data()
        state.typing.typing = doc.data().typing;
      });

    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub());
    });
  },
  getUsers() {
    const unsub = db.collection("chat-users").onSnapshot((snap) => {
      console.log("snapshot: getUsers");
      state.users = snap.docs.map((doc) => {
        return { ...doc.data(), userId: doc.id };
      });
    });

    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub());
    });
  },
  getOnlineStatus(id) {
    const unsub = db
      .collection("chat-users")
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
