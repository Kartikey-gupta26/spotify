let currentsong= new Audio();

function secToMinSec(seconds) {
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    // Format the result as "mm:ss"
    const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  
    return formattedTime;
}

function updatePosition(seconds,totalseconds){
    let percentage=((seconds/totalseconds)*100);
    var element=document.querySelector(".circle");
    // console.log("updating",percentage);
    element.style.left = percentage + "%"
}


async function getsongs(){
    //getting list of songs
    let a=await fetch("http://127.0.0.1:5501/songs/");
    let response= await a.text();
    // console.log(response)

    let div=document.createElement("div");
    div.innerHTML=response;

    let as=div.getElementsByTagName("a");
    // console.log(as[1]);

    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }    
    }
    return songs;
}


const playsong=(track,pause=false)=>{  
    //playing songs
    console.log(track);
    currentsong.src=track;
    document.querySelector(".songname").innerHTML=track.substring(6,track.length-4).replaceAll("%20"," ");
    if(!pause){
        play.src="http://127.0.0.1:5501/logos/pause3.svg"
        currentsong.play();
        // console.log(currentsong.currentTime);
    }

}




async function main(){
//getting songs
    let songs= await getsongs();
    // console.log(currentsong);
    // console.log(songs);  
    // console.log(songs[0]);
    playsong("songs/"+songs[0],true);


    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    // console.log(songUL);

    for (const song of songs) {
        let name=song.replaceAll("%20"," ");
        // console.log(name);
        songname=name.split(" - ")[0];
        artistname=name.split(" - ")[1];
        shortartistname=artistname.substring(0,artistname.length-4);
        songUL.innerHTML= songUL.innerHTML +
         `<li>
            <img src="logos/music.svg" alt="">
                <div class="info">
                    <div>${songname}</div>
                    <div>${shortartistname}</div>
                </div>
            <img src="logos/play-button-svgrepo-com.svg" alt="">
        </li>`;
    }

//ATTACHING EVENT LISTENER
    // Select the <ul> element with class "songlist"
    Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach(e=>{
        e.addEventListener("click",element=>{
            // console.log(e.getElementsByClassName("info")[0].firstElementChild.innerHTML +" - " + e.getElementsByClassName("info")[0].lastElementChild.innerHTML);
            playsong("songs/"+e.getElementsByClassName("info")[0].firstElementChild.innerHTML +" - " + e.getElementsByClassName("info")[0].lastElementChild.innerHTML+".mp3")
        })  
    });


//configuring controls
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            // console.log(play.src);
            console.log('play', currentsong.src);
            play.src="http://127.0.0.1:5501/logos/pause3.svg"
            currentsong.play()
            
        }
        else{
            currentsong.pause()
            // play.size="30";
            console.log('pause', currentsong.src);
            play.src="http://127.0.0.1:5501/logos/play-button-svgrepo-com.svg"
        }
    })
    
    
// TIME Update function
    currentsong.addEventListener("timeupdate",() => {
        // console.log(Math.floor(currentsong.currentTime));
        // console.log(Math.floor(currentsong.duration));
        document.querySelector(".songtime").innerHTML=secToMinSec(Math.floor(currentsong.currentTime))+" / "+secToMinSec(Math.floor(currentsong.duration));
        updatePosition(currentsong.currentTime,currentsong.duration)
    })
    
    
//Seeking song
    document.querySelector(".seekbar").addEventListener("click",(e) => {
        console.log((e.offsetX/e.target.getBoundingClientRect().width)*100);
        let percentage=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        var element=document.querySelector(".circle");
        // console.log("updating",percentage);
        element.style.left = percentage + "%"
        currentsong.currentTime=(percentage*currentsong.duration)/100;
    })
    
    
// Function to play the next song
    function playNext() {
        // Get the current index of the song in the playlist
        const currentIndex = songs.indexOf(currentsong.src.substring(currentsong.src.lastIndexOf("/") + 1));
        
        // Calculate the index of the next song
        const nextIndex = (currentIndex + 1) % songs.length;
        
        // Play the next song
        playsong("songs/" + songs[nextIndex]);
    }
    
// Function to play the previous song
    function playPrevious() {
        // Get the current index of the song in the playlist
        const currentIndex = songs.indexOf(currentsong.src.substring(currentsong.src.lastIndexOf("/") + 1));
        
        // Calculate the index of the previous song
        const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
        
        // Play the previous song
        playsong("songs/" + songs[previousIndex]);
    }
    
// Attach event listeners to the next and previous buttons
    document.getElementById("next").addEventListener("click", playNext);
    document.getElementById("prev").addEventListener("click", playPrevious);


//Adding event listner to hamburger
    document.querySelector(".hamburger").addEventListener("click",() => {
        document.querySelector(".left").style.left="0";
    })
    document.querySelector(".cross").addEventListener("click",() => {
        document.querySelector(".left").style.left="-110%";
    })
//Adding event listener to cross
}


main();

