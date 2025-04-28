export default  function () {
  const themeName = ref('dark')
  const setTheme = (sign: string) => {
    document.documentElement.classList.remove(`theme-${themeName.value}`);
    document.documentElement.classList.add(`theme-${sign}`);
    themeName.value = sign
    localStorage.setItem('theme', sign)
  }
  onMounted(() => {
    themeName.value = localStorage.getItem('theme') || 'dark'
    document.documentElement.classList.add(`theme-${themeName.value}`);
  })

  return {
    themeName,
    setTheme
  }
}