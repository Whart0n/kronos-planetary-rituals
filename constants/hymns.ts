// Orphic Hymns for planetary rituals
// These are ancient Greek hymns to the gods associated with the planets

import { PlanetDay } from '@/types';

export interface Hymn {
  id: string;
  planetId: PlanetDay;
  title: string;
  text: string;
  description: string;
}

// Array of hymns
export const hymns: Hymn[] = [
  {
    id: 'sun-hymn',
    planetId: 'sun',
    title: 'Orphic Hymn to Helios (Sun)',
    text: `Hear golden Titan, whose eternal eye
With broad survey illumines all the sky.
Self-born, unwearied in diffusing light,
And to all eyes the mirror of delight:
Lord of the seasons, with thy fiery car
And leaping coursers, beaming light from far.
With thy right hand the source of morning light,
And with thy left the father of the night.
Agile and vigorous, venerable Sun,
Fiery and bright around the heavens you run,
Foe to the wicked, but the good man's guide,
Over all his steps propitious you preside.
With various-sounding golden lyre 'tis thine
To fill the world with harmony divine.
Father of ages, guide of prosperous deeds,
The world's commander, borne by lucid steeds.
Immortal Zeus, flute-playing, bearing light,
Source of existence, pure and fiery bright;
Bearer of fruit, almighty lord of years,
Agile and warm, whom every power reveres.
Bright eye of Zeus and guard of oaths divine,
Worthy of honor to the good incline:
Whose orb, when rising, with its blazing light
Dispels the gloom and terrors of the night.
Show to thy suppliant a benignant mind,
And crown his wishes with success refined.`,
    description: 'This hymn invokes the power of the Sun for vitality, leadership, and success. It is traditionally recited on Sunday or during the planetary hour of the Sun.'
  },
  {
    id: 'moon-hymn',
    planetId: 'moon',
    title: 'Orphic Hymn to Selene (Moon)',
    text: `Hear, Goddess queen, diffusing silver light,
Bull-horned and wandering through the gloom of Night.
With stars surrounded, and with circuit wide
Night's torch extending, through the heavens you ride:
Female and Male, with silvery rays you shine,
And now full-orbed, now tending to decline.
Mother of ages, fruit-producing Moon,
Whose amber orb makes Night's reflected noon:
Lover of horses, splendid, queen of Night,
All-seeing power bedecked with starry light.
Lover of vigilance, the foe of strife,
In peace rejoicing, and a prudent life:
Fair hair, horned Moon, whose waxing rays increase,
Fair hair, horned Moon, whose waning brings us peace.
Labor to ease, the parent of delight,
Kind nurturer, wandering through the gloom of Night:
Horned and refulgent, through the ether shine,
And soothe our sorrows with thy light divine.`,
    description: 'This hymn invokes the power of the Moon for intuition, emotions, and psychic abilities. It is traditionally recited on Monday or during the planetary hour of the Moon.'
  },
  {
    id: 'mars-hymn',
    planetId: 'mars',
    title: 'Orphic Hymn to Ares (Mars)',
    text: `Magnanimous, unconquered, boisterous Mars,
In darts rejoicing, and in bloody wars;
Fierce and untamed, whose mighty power can make
The strongest walls from their foundations shake:
Mortal-destroying king, defiled with gore,
Pleased with war's dreadful and tumultuous roar.
Thee human blood and swords and spears delight,
And the dire ruin of mad savage fight.
Stay furious contests, and avenging strife,
Whose works with woe embitter human life;
To lovely Venus and to Bacchus yield,
To Ceres give the weapons of the field;
Encourage peace, to gentle works inclined,
And give abundance, with benignant mind.`,
    description: 'This hymn invokes the power of Mars for courage, strength, and protection. It is traditionally recited on Tuesday or during the planetary hour of Mars.'
  },
  {
    id: 'mercury-hymn',
    planetId: 'mercury',
    title: 'Orphic Hymn to Hermes (Mercury)',
    text: `Hermes, draw near, and to my prayer incline,
Angel of Zeus, and Maia's son divine;
Studious of contests, ruler of mankind,
With heart almighty, and a prudent mind.
Celestial messenger, of various skill,
Whose powerful arts could watchful Argus kill:
With winged feet, 'tis thine through air to course,
O friend of man, and prophet of discourse:
Great life-supporter, to rejoice is thine,
In arts gymnastic, and in fraud divine:
With power endued all language to explain,
Of care the loosener, and the source of gain.
Whose hand contains of blameless peace the rod,
Corucian, blessed, profitable God;
Of various speech, whose aid in works we find,
And in necessities to mortals kind:
Dire weapon of the tongue, which men revere,
Be present, Hermes, and thy suppliant hear;
Assist my works, conclude my life with peace,
Give graceful speech, and me memory's increase.`,
    description: 'This hymn invokes the power of Mercury for communication, intellect, and travel. It is traditionally recited on Wednesday or during the planetary hour of Mercury.'
  },
  {
    id: 'jupiter-hymn',
    planetId: 'jupiter',
    title: 'Orphic Hymn to Zeus (Jupiter)',
    text: `O Zeus much-honored, Zeus supremely great,
To thee our holy rites we consecrate,
Our prayers and expiations, king divine,
For all things to produce with ease through mind is thine.
Hence mother Earth and mountains swelling high
Proceed from thee, the deep and all within the sky.
Saturnian king, descending from above,
Magnanimous, commanding, sceptered Zeus;
All-parent, principle and end of all,
Whose power almighty shakes this earthly ball;
Even Nature trembles at thy mighty nod,
Loud-sounding, armed with lightning, thundering God.
Source of abundance, purifying king,
O various-formed, from whom all natures spring;
Propitious hear my prayer, give blameless health,
With peace divine, and necessary wealth.`,
    description: 'This hymn invokes the power of Jupiter for expansion, abundance, and wisdom. It is traditionally recited on Thursday or during the planetary hour of Jupiter.'
  },
  {
    id: 'venus-hymn',
    planetId: 'venus',
    title: 'Orphic Hymn to Aphrodite (Venus)',
    text: `Heavenly, illustrious, laughter-loving queen,
Sea-born, night-loving, of an awful mien;
Crafty, from whom necessity first came,
Producing, nightly, all-connecting dame:
'Tis thine the world with harmony to join,
For all things spring from thee, O power divine.
The triple Fates are ruled by thy decree,
And all productions yield alike to thee:
Whate'er the heavens, encircling all, contain,
Earth fruit-producing, and the stormy main,
Thy sway confesses, and obeys thy nod,
Awful attendant of the brumal God:
Goddess of marriage, charming to the sight,
Mother of Loves, whom banquetings delight;
Source of persuasion, secret, favoring queen,
Illustrious born, apparent and unseen:
Spousal, lupercal, and to men inclined,
Prolific, most-desired, life-giving, kind:
Great scepter-bearer of the Gods, 'tis thine
Mortals in necessary bands to join;
And every tribe of savage monsters dire
In magic chains to bind, through mad desire.
Come, Cyprus-born, and to my prayer incline,
Whether exalted in the heavens you shine,
Or pleased in Syria's temple to preside,
Or o'er the Egyptian plains thy car to guide,
Fashioned of gold; and near its sacred flood,
Fertile and famed to fix thy blest abode;
Or if rejoicing in the azure shores,
Near where the sea with foaming billows roars,
The circling choirs of mortals, thy delight,
Or beauteous nymphs, with eyes cerulean bright,
Pleased by the dusty banks renowned of old,
To drive thy rapid, two-yoked car of gold;
Or if in Cyprus with thy mother fair,
Where married females praise thee every year,
And beauteous virgins in the chorus join,
Adonis pure to sing and thee divine.`,
    description: 'This hymn invokes the power of Venus for love, beauty, and harmony. It is traditionally recited on Friday or during the planetary hour of Venus.'
  },
  {
    id: 'saturn-hymn',
    planetId: 'saturn',
    title: 'Orphic Hymn to Kronos (Saturn)',
    text: `Etherial father, mighty Titan, hear,
Great fire of Gods and men, whom all revere:
Endu'd with various council, pure and strong,
To whom perfection and decrease belong.
Consumed by thee all forms that hourly die,
By thee restored, their former place supply;
The world immense in everlasting chains,
Strong and ineffable thy power contains;
Father of vast eternity, divine,
O mighty Saturn, various speech is thine:
Blossom of earth and of the starry skies,
Husband of Rhea, and Prometheus wise.
Obstetric Nature, venerable root,
From which the various forms of being shoot;
No parts peculiar can thy power enclose,
Diffused through all, from which the world arose,
O, best of beings, of a subtle mind,
Propitious hear to holy prayers inclined;
The sacred rites benevolent attend,
And grant a blameless life, a blessed end.`,
    description: 'This hymn invokes the power of Saturn for discipline, boundaries, and wisdom. It is traditionally recited on Saturday or during the planetary hour of Saturn.'
  }
];