import React from "react"

export default function Meme() {
    // Define state variables
    const [meme, setMeme] = React.useState({
        topText: "", 
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg" // Initial value when reloaded
    })
    const [allMemes, setAllMemes] = React.useState([])
    
/**
NOTE: useEffect takes a function as its parameter. If that function
returns something, it needs to be a cleanup function. Otherwise,
it should return nothing. If we make it an async function, it
automatically retuns a promise instead of a function or nothing.
Therefore, if you want to use async operations inside of useEffect,
you need to define the function separately inside of the callback
function, as seen below:
*/
    React.useEffect(() => {
        // Defines an async function
        async function getMemes() {
            // Sends a GET request to the URL using fetch from the API
            const res = await fetch("https://api.imgflip.com/get_memes")
            /* 
            - Await the response using "await" to make sure
            the response is resolved before proceeding
            - Parse the response data as JSON */
            const data = await res.json()
            /* Update state (allMemes) with memes data and call the 
            setAllMemes to fetch the memes when the component is mounted */
            setAllMemes(data.data.memes)
        }
        getMemes()
    }, [])
    
    // Random meme image function 
    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const url = allMemes[randomNumber].url
        setMeme(prevMeme => ({
            ...prevMeme,
            randomImage: url
        }))
        
    }
    
    function handleChange(event) {
        const {name, value} = event.target
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }
    
    // DOWNLOAD IMAGES FUNCTION 
      function handleDownload() {
        // Canvas element
        const canvas = document.createElement("canvas");

        // Used to draw from the methods/properties to draw the images on the canvas
        const context = canvas.getContext("2d");
    
        const image = new Image();
        image.crossOrigin = "anonymous";
    
        image.onload = () => {
            // Sets the canvas dimensions to match the loaded image
          canvas.width = image.width;
          canvas.height = image.height;
          // Draws the loaded image to the canvas at (0,0) position
          context.drawImage(image, 0, 0);
    
         // Font styles
          context.font = "3.5rem impact";
          context.fillStyle = "white";
          context.textAlign = "center";

         // Add text shadow
           context.shadowColor = "black";
           context.shadowOffsetX = 2;
           context.shadowOffsetY = 2;
           context.shadowBlur = 10;

        
        //Here can adjust the width and height of the text for download
          context.fillText(meme.topText, canvas.width / 2, 70);
          context.fillText(meme.bottomText, canvas.width / 2, canvas.height - 20);
    
          // Created a blob object to handle the data to create a downloadable image file

          // Convert canvas to a Blob object
          canvas.toBlob((blob) => {
            //Converts the blob object into a URL to be downloadable
            const url = URL.createObjectURL(blob);
            // A link element
            const link = document.createElement("a");
            link.href = url;
            link.download = "meme.jpg";

            // This creates a click event on link element
            link.click();
            // Revoke the url to save memory & prevent memory leaks/free up resources
            // This allows the browser to release the memory associated once the image is downloaded
            URL.revokeObjectURL(url);
          }, "image/jpeg");
        };

       
    
        image.src = meme.randomImage;
    }
    
    return (
        <main>
            {/* FORM */}
            <div className="form">
                <input 
                    type="text"
                    placeholder="Top text"
                    className="form--input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    placeholder="Bottom text"
                    className="form--input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <button 
                    className="form--button"
                    onClick={getMemeImage}
                >
                    Get a new meme image 🖼
                </button>
            </div>
            {/* MEME IMAGE AREA */}
            <div className="meme">
                <img src={meme.randomImage} className="meme--image" />
                <h2 className="meme--text top">{meme.topText}</h2>
                <h2 className="meme--text bottom">{meme.bottomText}</h2>
            </div>
            <button className="form--button" onClick={handleDownload}>Download</button>
        </main>
    )
}