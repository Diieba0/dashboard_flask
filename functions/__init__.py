def extract_answers(texts):
    oui = []
    non = []

    for i, text in enumerate(texts):
        # Extraction des éléments selon la structure JSON renvoyée par l'API grand debat
        reponse = text["Anonyme"]

        # Stockage des articles dans la variable articles
        if reponse == "Oui":
            oui.append(reponse)
        elif reponse == "Non":
            non.append(reponse)
        else:
            break

    return oui, non


def extract_themes(texts):
    themes = []

    for i, text in enumerate(texts):
        # Extraction des éléments selon la structure JSON renvoyée par l'API grand debat
        theme = text["Sur quel s theme s votre reunion a t elle porte"]

        # Stockage des articles dans la variable articles
        if theme in themes:
            continue
        else:
            themes.append(theme)

    return themes


def extract_participants_total(texts):
    villes = []
    participants = []
    participation_totale_par_ville = {}

    for i, text in enumerate(texts):
        # Extraction des éléments selon la structure JSON renvoyée par l'API NEWSAPI.ORG
        ville = text["Ville"].lower()
        participants_ville = text["Combien de participants etaient presents"]

        # stockage des données
        if type(participants_ville) == int:
            villes.append(ville)
            participants.append(participants_ville)
        else:
            continue

        for index in range(len(villes)):
            ville = villes[index]
            participants_exact = participants[index]

            if ville not in participation_totale_par_ville.keys():
                participation_totale_par_ville[ville] = participants_exact

            else:
                participation_totale_par_ville[ville] += participants_exact

    return participation_totale_par_ville

# def extract_participants_par_ville(villes, participants):
#         else:
#             ville = villes[i]
#             participation_totale[ville] += participants_exact


# def tri_villes_participantes(participation, ville):
#     participants_de_plus = 0
#     for i in participation:
#         if i[0] == ville:
#             participants_de_plus += i[1]
#             #participation.pop(i)
#
#     return participants_de_plus
