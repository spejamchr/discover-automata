<picture>
 <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/spejamchr/discover-automata/main/5.7.685970445153587909765156071183826318147427356496819909180746345369600859897652333069673-dark.png">
 <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/spejamchr/discover-automata/main/5.7.685970445153587909765156071183826318147427356496819909180746345369600859897652333069673-light.png">
 <img alt="A pattern generated with a 5-state cellular automaton" src="https://raw.githubusercontent.com/spejamchr/discover-automata/main/5.7.685970445153587909765156071183826318147427356496819909180746345369600859897652333069673-light.png">
</picture>

# Discover Automata

A simple cellular automata emulator built with [NextJS] and [CooperTS] and styled with
[tailwindcss].

I think cellular automata are fun and can make nice looking designs, and I wanted to lean into that.

[NextJS]: https://nextjs.org/
[CooperTS]: https://github.com/execonline-inc/CooperTS
[tailwindcss]: https://tailwindcss.com/

## CooperTS?

CooperTS is an Elm-inspired functional programming library for Typescript that I use and contribute
to as part of my day job. I enjoy using it enough that I decided to use parts of it here, too. It is
focused on using the compiler to eliminate run-time errors.

## Translations

This whole little project is a place for me to play, and that is particularly true of the
translations. I implemented my own translation system that works with NextJS's Static Site
Generation (NextJS's built-in translation routing [doesn't work with SSG]). It is also
strongly-typed: if I create a new translation but forget to provide a translation for one of the
supported languages the project will fail to compile.

Most of the site is translated into Portuguese and Japanese. However, the translation quality is not
great; I used Google Translate and proof-read the results myself, but my Portuguese is rusty and I'm
only a beginner in Japanese.

[doesn't work with SSG]: https://nextjs.org/docs/advanced-features/i18n-routing#how-does-this-work-with-static-generation

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploying

Push to main. [Vercel] will handle the rest.

[Vercel]: https://vercel.com/dashboard
