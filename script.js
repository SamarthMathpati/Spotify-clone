async function getSongs(){
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href)  // Push the full href
        }
    }
    return songs
}

// Function to clean and format song names
function cleanSongName(songUrl) {
  // First decode the URL to handle %5C (backslash) and %20 (space)
  let decoded = decodeURIComponent(songUrl);
  
  // Get the last part after the final slash or backslash
  let fileName = decoded.split(/[/\\]/).pop();
  
  // Remove .mp3 extension
  fileName = fileName.replace('.mp3', '');
  
  // Remove bitrate info like "128 Kbps", "320 Kbps", "2 128 Kbps" etc.
  fileName = fileName.replace(/\s*\d+\s*\d*\s*Kbps\s*$/i, '');
  
  return fileName.trim();
}

// Main function
async function main() {
  let songs = await getSongs();
  console.log("Raw songs array:", songs);
  
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  
  for (const song of songs) {
    console.log("Processing song:", song);
    
    // Extract clean song name
    const displayName = cleanSongName(song);
    console.log("Display name:", displayName);
    
    // Create list item with music icon and play button
    songUL.innerHTML = songUL.innerHTML + 
      `<li data-song-url="${song}" style="display: flex; align-items: center; gap: 12px; padding: 16px 20px; cursor: pointer;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0; color: #fff;">
          <path d="M9 18V5L21 3V16M9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.3431 4.34315 15 6 15C7.65685 15 9 16.3431 9 18ZM21 16C21 17.6569 19.6569 19 18 19C16.3431 19 15 17.6569 15 16C15 14.3431 16.3431 13 18 13C19.6569 13 21 14.3431 21 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span style="flex: 1; color: #fff; font-size: 16px;">${displayName}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0; color: #fff;">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M10 8L16 12L10 16V8Z" fill="currentColor"/>
        </svg>
      </li>`;
  }
  
  // Add click event to play songs
  const songItems = songUL.getElementsByTagName("li");
  let currentAudio = new Audio();
  
  Array.from(songItems).forEach((item, index) => {
    item.addEventListener("click", () => {
      const songUrl = item.getAttribute("data-song-url");
      currentAudio.src = songUrl;
      currentAudio.play();
      
      currentAudio.addEventListener("loadeddata", () => {
        console.log(currentAudio.duration, currentAudio.currentSrc, currentAudio.currentTime);
      });
    });
  });
}

// Call main function
main();
