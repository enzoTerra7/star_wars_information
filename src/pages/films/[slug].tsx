import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";

import styles from './styles.module.scss'

import Head from "next/head";

import { useEffect, useState } from "react";

import axios from "axios";

type EpisodeObject = {
    episode: {
        title: string,
        characters: Array<string>,
        sinopse: string,
        id: number,
        director: string,
        producer: string,
        date: string,
    };
}

export default function filmes ({episode}: EpisodeObject) {

    const persons = episode.characters

    const [characters, setCharacters] = useState([])

    const currencyDate = episode.date.split('-')

    const [year, mounth, day] = currencyDate

    const ptBrDate = `${day} - ${mounth} - ${year}`

    const howIsThePerson = async () => {
        await persons.forEach(async element => {
            let { data } = await axios.get(`${element}`)
            setCharacters((p) => [...p, data.name] )
        });
    }

    useEffect( () => {
        howIsThePerson()
    },[persons])

    return (
        <div className={styles.mainContainer}>

            <Head>
                <title>Filme | {episode.title} </title>
            </Head>

            <div className={styles.top}>
                <img src="/star-wars-logo-3-1.png" alt="logo star wars"/>
            </div>

            <div className={styles.middle}>
                <h1>{episode.title}</h1>
            </div>

            <div className={styles.bot} >
                <h2>Personagens:</h2>
                <div>
                    {characters.map( (p, index) => (
                        <button key={index}>
                            {p}
                        </button>
                    ))}
                </div>
            </div>
            <div className={styles.sinopse}>
                <h2>Sinopse: <small>{episode.title}</small></h2>
                <span>Episodio {episode.id}</span>
                {episode.sinopse}
                <div className={styles.data}>
                    <strong>Dados importantes</strong>
                    <ul>
                        <li>
                            Diretor: {episode.director};
                        </li>
                        <li>
                            Produtor: {episode.producer};
                        </li>
                        <li>
                            Data de lançamento: {ptBrDate};
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {

    const { data } = await api.get('films/')

    const filmes = data.results

    const paths = filmes.map( e => {
        return {
            params: {
                slug: e.title
            }
        }
    })

    return{
        paths,
        fallback: 'blocking',
    }
};

export const getStaticProps: GetStaticProps = async (ctx) => {

    const { slug } = ctx.params
    
    const { data } = await api.get(`/films/${slug}`)

    const episode = {
        title: data.title,
        characters: data.characters,
        sinopse: data.opening_crawl,
        id: data.episode_id,
        director: data.director,
        producer: data.producer,
        date: data.release_date,
    }
    
    return{
        props: {
            episode
        },
        revalidate: 60 * 60 * 24,
    }
}