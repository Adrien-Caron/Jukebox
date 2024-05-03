const playlist = document.getElementById("playlist");
const randomButton = document.createElement("button");
randomButton.textContent = "Choisir une musique aléatoire";
randomButton.id = "randomButton";
document.body.appendChild(randomButton); // Ajoute le bouton au corps du document

const dureeMusique = document.getElementById("dureeMusique"); // Sélectionne l'élément pour afficher la durée

const config = {
    urlCover : "covers/",
    urlSound : "musics/",
};

const getData = async () =>{
    const req = await fetch("https://api-vinyle.onrender.com/api/v1/musics");
    console.log(req);
    const dbMusic = await req.json();
    data = dbMusic.result ; 
    console.log("result ", dbMusic);

    // Écoute l'événement pause du lecteur pour arrêter la rotation de la couverture
    lecteur.addEventListener("pause", function() {
        const rotatingCover = document.querySelector(".rotate");
        if (rotatingCover) {
            rotatingCover.classList.remove("rotate");
        }
    });

    // Écoute l'événement play du lecteur pour reprendre la rotation de la couverture
    lecteur.addEventListener("play", function() {
        const pausedCover = document.querySelector(".pause");
        if (pausedCover) {
            pausedCover.classList.add("rotate");
        }
    });

    randomButton.addEventListener("click", function() {
        // Supprime la classe "rotate" de toutes les couvertures d'album
        const allCovers = document.querySelectorAll(".rotate");
        allCovers.forEach((cover) => {
            cover.classList.remove("rotate");
        });

        // Sélectionne une musique aléatoire depuis la base de données
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomMusic = data[randomIndex];
        
        // Met à jour le lecteur avec la musique aléatoire sélectionnée
        if (randomMusic) {
            console.log(randomMusic);
            // alert(`Veux-tu écouter le titre : ${randomMusic.title}`);
            lecteur.src = `${config.urlSound}${randomMusic.sound}`;
            lecteur.play(); // Lancer la musique automatiquement
            
            // Ajoute la classe "rotate" à l'élément img de l'élément li sélectionné aléatoirement
            const selectedLi = document.getElementById(randomMusic.id);
            const coverImg = selectedLi.querySelector("img");
            coverImg.classList.add("rotate");
            
            // Écoute l'événement timeupdate pour suivre le progrès de la musique
            lecteur.addEventListener("timeupdate", function() {
                // Supprime la classe "rotate" lorsque la musique se termine
                if (lecteur.currentTime >= lecteur.duration) {
                    coverImg.classList.remove("rotate");
                }
            });
        } else {
            console.log("Aucune musique trouvée.");
        }
    });

    data.forEach((music) => {
        playlist.innerHTML += `<li id="${music.id}"><h2>${music.title} </h2><img src="${config.urlCover}${music.cover}" /><div><small>  </small> </div></li> ` 
    });

    const allLi = document.querySelectorAll("li");

    allLi.forEach((li) => {   
        li.addEventListener("click", function(elem) {
            const id = parseInt(li.id);
            const searchById = data.find((element) => element.id === id);
            if (searchById) {
                console.log(searchById);
               alert(`Veux-tu écouter le titre : ${searchById.title}`);
                lecteur.src = `${config.urlSound}${searchById.sound}`;
                lecteur.play(); // Lancer la musique automatiquement
            } else {
                console.log("Aucune musique trouvée avec cet ID.");
            }
        });
    });

    // Événement pour afficher la durée de la musique sur la page
    lecteur.addEventListener("loadedmetadata", function() {
        const minutes = Math.floor(lecteur.duration / 60);
        const secondes = Math.floor(lecteur.duration % 60);
        dureeMusique.textContent = `Durée : ${minutes}:${secondes}`;
    });
}

getData();