
document.querySelectorAll('.tool-section').forEach(div => {
  div.addEventListener('click', event => {
    event.stopPropagation()
    // console.log("@@ element: ", event.target.closest('.tool-section').id)

    const content = event.target.closest('.tool-section').querySelector('.section-content')
    // console.log("::content::", content)
    if (window.getComputedStyle(content).display === 'block') {
      // hide element
      content.style.display = 'none'
    } else {
      // show element
      content.style.display = 'block'
    }
  })
})
