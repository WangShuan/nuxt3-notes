interface UserData {
  email: string,
  password: string
}

const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser()

  const SignUp = async (userData: UserData, name: string) => {
    const { data: u, error } = await supabase.auth.signUp({
      ...userData,
      options: {
        data: {
          name: name,
        }
      }
    })

    if (error) throw error
    return u
  };

  const LogIn = async (userData: UserData) => {
    const { data: u, error } = await supabase.auth.signInWithPassword(userData)
    if (error) throw error
    return u
  }

  const LogOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const ResetPassword = async (pwd: string) => {
    const { data: u, error } = await supabase.auth.updateUser({ password: pwd })
    if (error) throw error
    return u
  }
  return { user, SignUp, LogIn, LogOut, ResetPassword }
}

export default useAuth;