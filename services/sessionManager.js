module.exports = {
  createSession: async (email) => {
    return {
      id: "sess_" + Date.now(),
      user: email
    };
  }
};