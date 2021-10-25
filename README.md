# The House Dashboard

A simple, quick project to build and set up a dashboard to keep track of things! 

Using just vanilla HTML, CSS and JS, and Firebase for our DB, I'm aiming to keep track of our meal plans, shoppling lists and upcoming events!

The dashboard will be displayed on an old monitor hooked up to a PiZero in the kitchen or hallway to keep it in mind. 

Eventually I hope to add in some calanders and maybe some RSS or news feeds!

## Credentials

Firebase credentials are stored locally in the scripts/base.js file.
This file can contain the following secrets to enable various APIs:
 
        var firebaseConfig = {};
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
        var secrets = {
            OPEN_WEATHER_API: '',
            APOTD_API: '',
            DAD_JOKE: '',
            CAT_FACT: '',
            QUOTES: '',
        };

You can get Keys and configs for each of these from their websites:

- [firebase](https://firebase.google.com)
- [open weather api](https://openweathermap.org/api)
- [nasa apod api](https://github.com/nasa/apod-api)
- [dad jokes](https://github.com/Sv443/JokeAPI)
- [cat facts](https://catfact.ninja/)
- [quotes](https://github.com/lukePeavey/quotable)