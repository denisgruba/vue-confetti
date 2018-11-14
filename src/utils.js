export const generateWholeNumber = (min, max) => {
  return (
    min +
    Math.floor(
      Math.random() *
      (
        max - min
      )
    )
  )
}
