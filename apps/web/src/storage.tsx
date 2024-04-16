export const storage = {
  auth: {
    setToken(value: string) {
      localStorage.setItem('token', value)
    },
    getToken() {
      return localStorage.getItem('token')
    },
    removeToken() {
      localStorage.removeItem('token')
    }
  }
}
