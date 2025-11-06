const emojis = [
    '😀', '😀', '😎', '😎', '🥳', '🥳', '🤩', '🤩', '😍', '😍',
    '🤔', '🤔', '🤯', '🤯', '🥶', '🥶', '🤠', '🤠'
];

let hasStarted = false;

emojis.sort(() => Math.random() - 0.5);

for (let i = 0; i < emojis.length; i++) {
    const card = document.createElement('div');
    card.id = "card" + i;
    card.classList.add('card');
    card.classList.add('start');
    card.innerText = emojis[i];

    document.querySelector('.container').appendChild(card);

    card.onclick = function() {
        if (!hasStarted) {
            let allCards = document.querySelectorAll(".card");

            for (let card of allCards) {
                card.classList.remove("start");
            }

            hasStarted = true;
        }

        flipCard(i);
    }
}

function flipCard(index) {
    const card = document.getElementById("card" + index);
    let flippedCards = document.querySelectorAll(".flipped");

    if (!hasStarted) {
        return;
    }

    if (card.classList.contains("flipped") || card.classList.contains("correct")) {
        return;
    }

    card.classList.add("flipped");

    let soundFlip = new Audio("./audio/flipcard.mp3");
    soundFlip.volume = 0.5;
    soundFlip.play();

    if (flippedCards.length != 1) {
        return;
    }

    if (card.innerText == flippedCards[0].innerText) {
        card.classList.add("correct");
        flippedCards[0].classList.add("correct");

        card.classList.remove("flipped");
        flippedCards[0].classList.remove("flipped");

        let soundCorrect = new Audio("./audio/correct.mp3");
        soundCorrect.volume = 0.5;
        soundCorrect.play();

        if (document.querySelectorAll(".correct").length == emojis.length) {
            document.getElementById("textWin").style.display = "block";
        }

        return
    }

    setTimeout(function() {
        card.classList.remove("flipped");
        flippedCards[0].classList.remove("flipped");
    }, 500)
}
