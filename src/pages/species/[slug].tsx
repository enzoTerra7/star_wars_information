import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";

import styles from './styles.module.scss'

import Head from "next/head";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

type HomeProps = {
    starship: {
        name: string,
        classification: string,
        designation: string,
        hair_color: string,
        skin_color: string,
        eye_color: string,
        average_height: string,
        average_lifespan: string,
        language: string,
        planet: string,
        people: Array<string>,
        films: Array<string>,
    }
}

export default function Starship ({starship}: HomeProps) {

    const details = [
        {
            id: 'classification',
            value: starship.classification
        },
        {
            id: 'language',
            value: starship.language
        },
        {
            id: 'designation',
            value: starship.designation
        },
        {
            id: 'hair_color',
            value: starship.hair_color
        },
        {
            id: 'skin_color',
            value: starship.skin_color
        },
        {
            id: 'eye_color',
            value: starship.eye_color
        },
        {
            id: 'average_height',
            value: starship.average_height
        },
        {
            id: 'average_lifespan',
            value: starship.average_lifespan
        }
    ]

    const [movie, setMovie] = useState([])
    
    const movies = starship.films

    const [people, setPeople] = useState([])

    const {planet} = starship

    const [home, setHome] = useState([])

    const peoples = starship.people

    const howIsThePerson = async () => {

        let { data } = await axios.get(`${planet}`)
        let newUrl = data.url.slice(20)
        setHome((p) => [...p, {name: data.name, url: newUrl}] )

        if(peoples.length > 0) {
            await peoples.forEach(async element => {
                let { data } = await axios.get(`${element}`)
                let newUrl = data.url.slice(20)
                setPeople((p) => [...p, {name: data.name, url: newUrl}] )
            });
        }

        if(movies.length > 0) {
            await movies.forEach(async element => {
                let { data } = await axios.get(`${element}`)
                let newUrl = data.url.slice(20)
                setMovie((p) => [...p, {title: data.title, url: newUrl}] )
            });
        }
    } 

    useEffect( () => {
        setHome([])
        setPeople([])
        setMovie([])
        howIsThePerson()
    },[peoples])


    return (
        <div className={styles.mainContainer}>

            <Head>
                <title>Espécie | {starship.name} </title>
            </Head>

            <div className={styles.top}>
                <img src="/star-wars-logo-3-1.png" alt="logo star wars"/>
            </div>

            <div className={styles.middle}>
                <h1>{starship.name}</h1>
            </div>

            <div className={styles.bot} >
                <h2>Detalhes:</h2>
                <div className={styles.details}>
                    {details.map( (p, index) => (
                        <button key={index}>
                            {p.id}: {p.value}
                        </button>
                    ))}
                </div>
                <h2>Nação:</h2>
                <div className={styles.movies}>
                    {people.length <= 0 &&(
                        <button>
                            Sem ninguém dessa espécie
                        </button>
                    )}
                    {people.map( (p, index) => (
                        <Link key={index} href={`${p.url}`}>
                            <button>
                                {p.name}
                            </button>
                        </Link>
                    ))}
                </div>
                <h2>Planeta natal:</h2>
                <div className={styles.movies}>
                    {home.length <= 0 &&(
                        <button>
                            Sem planeta natal
                        </button>
                    )}
                    {home.map( (p, index) => (
                        <Link key={index} href={`${p.url}`}>
                            <button>
                                {p.name}
                            </button>
                        </Link>
                    ))}
                </div>
                <h2>Apareceu nos filmes:</h2>
                <div className={styles.movies}>
                    {movie.length <= 0 &&(
                        <button>
                            Sem planeta natal
                        </button>
                    )}
                    {movie.map( (p, index) => (
                        <Link key={index} href={`${p.url}`}>
                            <button>
                                {p.title}
                            </button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}


export const getStaticPaths: GetStaticPaths = async () => {

    const { data } = await api.get('/species')

    const person = data.results

    const paths = person.map( e => {
        return {
            params: {
                slug: e.name,
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
    
    const { data } = await api.get(`/species/${slug}/`)

    const starship = {
        name: data.name,
        classification: data.classification,
        designation: data.designation,
        hair_color: data.hair_colors,
        skin_color: data.skin_colors,
        eye_color: data.eye_colors,
        average_height: data.average_height,
        average_lifespan: data.average_lifespan,
        people: data.people,
        planet: data.homeworld,
        language: data.language,
        films: data.films
    }
    
    return{
        props: {
            starship
        },
        revalidate: 60 * 60 * 24,
    }
}