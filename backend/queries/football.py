from sqlalchemy import select
from db import session_factory
from models import GoalsTable, MatchesTable, TeamsTable, StadiumsTable, TournamentsTable
from sqlalchemy.orm import aliased

def select_matches():
    with session_factory() as session:
        Team1 = aliased(TeamsTable)
        Team2 = aliased(TeamsTable)
        Stadium = aliased(StadiumsTable)
        Tournament = aliased(TournamentsTable)

        query = (
            select(MatchesTable, Team1, Team2, Stadium, Tournament)
            .join(Team1, MatchesTable.team1_id == Team1.id)
            .join(Team2, MatchesTable.team2_id == Team2.id)
            .join(Stadium, MatchesTable.stadium_id == Stadium.id)
            .join(Tournament, MatchesTable.tournament_id == Tournament.id)
        )

        matches = session.execute(query).all()

        data = []
        for match, team1, team2, stadium, tournament in matches:
            goals_query = (
                select(GoalsTable)
                .where(GoalsTable.match_id == match.id)
                .order_by(GoalsTable.minute)
            )
            goals = session.execute(goals_query).scalars().all()

            goals_by_team = {
                team1.id: [],
                team2.id: []
            }
            for goal in goals:
                goals_by_team[goal.team_id].append({
                    "minute": goal.minute,
                    "scorer": goal.scorer,
                })

            data.append({
                "id": match.id,
                "score": match.score,
                "date": match.match_date,
                "stadium": stadium.name,
                "tournament": tournament.name,
                "image": match.image,
                "stage": match.stage,
                "team1": {
                    "name": team1.name,
                    "logo": team1.logo,
                    "xg": match.team1_xg,
                    "shots": match.team1_shots,
                    "shots_on_target": match.team1_shots_on_target,
                    "possession": match.team1_possession,
                    "goals": goals_by_team.get(team1.id, [])
                },
                "team2": {
                    "name": team2.name,
                    "logo": team2.logo,
                    "xg": match.team2_xg,
                    "shots": match.team2_shots,
                    "shots_on_target": match.team2_shots_on_target,
                    "possession": match.team2_possession,
                    "goals": goals_by_team.get(team2.id, [])
                }
            })


        return data
