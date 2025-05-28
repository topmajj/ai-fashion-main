// This script can be used to inject the language toggle into the dashboard header
// without modifying the original layout.tsx file

document.addEventListener("DOMContentLoaded", () => {
  // Find the header element where we want to inject our language toggle
  const headerButtonsContainer = document.querySelector(
    "header .flex.items-center.gap-2.lg\\:gap-4.w-full.lg\\:w-auto.justify-end",
  )

  if (headerButtonsContainer) {
    // Create a container for our language toggle
    const languageToggleContainer = document.createElement("div")
    languageToggleContainer.id = "language-toggle-container"

    // Insert the container as the first child of the header buttons container
    headerButtonsContainer.insertBefore(languageToggleContainer, headerButtonsContainer.firstChild)

    console.log("Language toggle container injected successfully")
  } else {
    console.error("Could not find header buttons container")
  }
})
