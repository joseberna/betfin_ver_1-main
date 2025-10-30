import hiddenhidden from '../../assets/game/card_back.png';

const url = (name) => `${process.env.PUBLIC_URL}/cards-svg/${name}.svg`;

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['c', 'd', 'h', 's']; 

const cards = { hiddenhidden };


for (const s of suits) {
  for (const r of ranks) {
    const key = `${s}${r}`;
    cards[key] = url(key);
  }
}

export default cards;
