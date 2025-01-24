--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Debian 14.13-1.pgdg120+1)
-- Dumped by pg_dump version 14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Character; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Character" (id, name, description) FROM stdin;
1	Jonathan Sims	Head archivist of the Magnus Institute, London.
2	Elias Bouchard	Head of the Magnus Institute, London.
3	Gertrude Robinson	Former head archivist of the Magnus Institute, London. Recently passed away. 
4	Timothy Stoker	Archivist assistant.
5	Sasha James	Archivist assistant.
6	Martin Blackwood	Archivist assistant.
7	Nathan Watts	Statement giver on Angler Fish.
8	Michael MacAulay	Friend of Nathan Watts
10	Jessica McEwen	Missing person a few days later after Nathan Watts' encounter in Old Fishmarket Close. November 2005
12	Daniel Rawlings	Missing person a few days later after Nathan Watts' encounter in Old Fishmarket Close. December 2006.
9	John Fellowes	Missing person a few days later after Nathan Watts' encounter in Old Fishmarket Close. March 2010.
11	Sarah Baldwin	Missing person a few days later after Nathan Watts' encounter in Old Fishmarket Close. August 2006. Smoker.
14	Megan Shaw	Missing person a few days later after Nathan Watts' encounter in Old Fishmarket Close. June 2008. Smoker.
15	Siobhan Dobson	Sister of Ashley Dobson, recieved the photo of the stranger in Old Fishmarket Close.
13	Ashley Dobson	Missing person in Old Fishmarket Close. May 2008. Managed to take a picture of the stranger on Old Fishmarket Close before disappearing. "Check out this drunk creep, lol"
16	Joshua Gillespie	Statement giver on Do Not Open
17	"John"	Undescribable stranger that sat with Joshua Gillespie on Amsterdam and tasked him with looking after a wooden coffin in exchange of a large sum of money.
\.


--
-- Data for Name: Episode; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Episode" (id, title, number, "releaseDate", "createdAt", description, "caseNumber", season, entity) FROM stdin;
2	Do Not Open	2	2016-03-25 03:00:00	2025-01-22 12:01:35.718	Statement of Joshua Gillespie regarding his time in the possession of an apparently empty wooden casket. 	9982211	1	THE BURIED
1	Angler Fish	1	2016-03-24 03:00:00	2025-01-22 10:40:08.205	Statement of Nathan Watts regarding an encounter on Old Fishmarket Close, Edinburgh. \nNote: 86-91 G/H	0122204	1	THE STRANGER
\.


--
-- Data for Name: EpisodesOnCharacters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EpisodesOnCharacters" ("episodeId", "characterId") FROM stdin;
1	1
1	2
1	3
1	4
1	6
1	5
1	7
1	8
1	9
1	10
1	11
1	12
1	13
1	14
1	15
2	1
2	4
2	16
2	17
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, username, password, mail, role) FROM stdin;
1	archivist	$2b$10$ooiImNe335WJArNFdATLYOjCMTp4.D3akHajJCofvaC4iDPk4n/OW	roque.andoni@tma.com	ADMIN
\.


--
-- Data for Name: UserEpisodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserEpisodes" ("userId", "episodeId", heard) FROM stdin;
1	1	t
1	2	t
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
94e3cdcf-a5bf-4333-b7d8-5d55426baa5a	91a3f515fd877247712d5e71250effe1381b05da7822131856871d6118af4c80	2025-01-22 10:38:00.31889+00	20241115110700_add_cascade_to_episodes_relations	\N	\N	2025-01-22 10:38:00.315529+00	1
7af0d2fd-b3e4-4e20-87b4-a4efc5a0064e	22a9bfcb35d310d928ea00e3ed9eaf6e14f2268edd6d652996b3ad2ea14dc1d7	2025-01-22 10:38:00.249012+00	20241022140800_first	\N	\N	2025-01-22 10:38:00.239305+00	1
db8de3f2-9761-4213-beba-77765476ce92	f1801cae8b5b4dbdda364319918c277fe54fbab060b235feae4cf26704851696	2025-01-22 10:38:00.255763+00	20241023114218_add_users	\N	\N	2025-01-22 10:38:00.249568+00	1
53cc21b1-416c-450c-a7ac-c829dcb129ec	6823032353692481c8c8699a39116698a5677daae53b3c757c99fa9cd9d555b2	2025-01-22 10:38:00.266466+00	20241023114419_users_correction	\N	\N	2025-01-22 10:38:00.256437+00	1
de3c050f-7798-4cf4-a69a-cd333ded6c3d	5a7b2eea9868ea3ac0a53cbddd9f2a96599eb87e4637de8a8b299c361c385636	2025-01-22 10:38:00.324768+00	20241209112159_add_user_role_and_episode_tracking	\N	\N	2025-01-22 10:38:00.319647+00	1
788e0b7a-04bf-443d-ad7a-4fc7ccadc538	15ea0537f7005680b379a59d1d4a2dc3f18344794f0801bae70d6f74a44e4f46	2025-01-22 10:38:00.26909+00	20241029143809_added_heard_field	\N	\N	2025-01-22 10:38:00.267338+00	1
2edca29e-784c-4e21-b5e3-d22955e8c790	5273ae923d07581a8f9b1a87afbba3de82a60a76e60c33b8f06246aa058c6d27	2025-01-22 10:38:00.27129+00	20241029153540_added_case_number_field	\N	\N	2025-01-22 10:38:00.269627+00	1
cf5a4536-ab4e-4842-8817-0cae9d1334da	b96ecb99376cecd2d65ba19fd71a21d741a81f424d8d62c7bc5632d052a22c61	2025-01-22 10:38:00.279239+00	20241029155111_changed_type_case_number_field	\N	\N	2025-01-22 10:38:00.271818+00	1
0716c179-1dd7-4dbd-9952-c9a308ecfa3c	c0bb94ea83a8b37c798b50e973f054f5d615b91d4ceb0aae53df86a9893982cf	2025-01-22 10:38:00.327961+00	20250117124545_add_entity_enum_to_episode	\N	\N	2025-01-22 10:38:00.325627+00	1
f32e910b-8a1c-4995-aa92-4260641f56ed	feea837c078c69ccd229ca57f897d9bc058012fadae287d0985d56cc11dcd477	2025-01-22 10:38:00.286671+00	20241029164359_update_type_case_number_field	\N	\N	2025-01-22 10:38:00.279972+00	1
be08d065-7b0e-4aaf-ae92-c1f060827aaf	1173a24699461004e29d0b8be8dc32769a6a649400c27e6fd509682847c82a88	2025-01-22 10:38:00.292907+00	20241031115723_update_schema_to_episode_character_relation	\N	\N	2025-01-22 10:38:00.287364+00	1
4d9d0982-ea2a-40a8-9891-081871a5de09	684bcf7de7f7aeef8967916ed6917482f06e0e146a1dabf945b74cf030b27ad2	2025-01-22 10:38:00.295892+00	20241031135721_update_season_field_on_episode_table	\N	\N	2025-01-22 10:38:00.293497+00	1
3c56766c-e6c0-4deb-ab14-5ae8511fcca7	ac551c9066a7dd0000e887663cdc0818e667d74eb3ee8997432482a55c0b7723	2025-01-22 10:38:00.301916+00	20241101141411_add_episode_character_relationship	\N	\N	2025-01-22 10:38:00.297136+00	1
c8084607-2f47-4425-b5d5-41de48177b3f	ad65970920c9223810a8b13e5ed7b289014485aefd7f895a5c102f48d50b4ee8	2025-01-22 10:38:00.307751+00	20241103123843_add_episode_character_relation	\N	\N	2025-01-22 10:38:00.302454+00	1
c02e8866-dfc1-4683-bd31-30a02216c929	e3da8218eb8c3e7bcd6370e382fe7688fb8db21ab859d4a60e2dfac655403ea5	2025-01-22 10:38:00.314855+00	20241110152737_update_many_to_many_relation	\N	\N	2025-01-22 10:38:00.308352+00	1
\.


--
-- Name: Character_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Character_id_seq"', 17, true);


--
-- Name: Episode_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Episode_id_seq"', 2, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- PostgreSQL database dump complete
--

