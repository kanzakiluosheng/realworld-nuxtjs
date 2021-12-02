export default function ({ store, redirect }) {
    // If the user is not authenticated
    const {user}=store.state;
    if (!user) {
      return redirect('/login')
    }
  }