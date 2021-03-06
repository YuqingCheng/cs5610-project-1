defmodule OthelloWeb.PageController do
  use OthelloWeb, :controller
  alias Othello.Game

  def index(conn, params) do
    if params["info"] do
      render conn, "index.html", info: params["info"]
    else
      render conn, "index.html", info: nil
    end
  end

  def lobby(conn, _params) do
    games = Game.get_all_games
    game_num = Kernel.length(Map.keys(games))
    if game_num == 0 do
      render conn, "index.html", info: "Empty lobby now, please create a game"
    else
      render conn, "lobby.html", games: games, game_num: game_num
    end
  end

  def game(conn, params) do
    curr_game = Game.get_state params["game"]
    user_name = get_session(conn, :user_name)

    if curr_game do
      # game exists
      players = curr_game.players
      if Kernel.length(players) == 2 || user_name && String.length(user_name) > 0 do
        # if user is player or game has started, forward to game
        render conn, "game.html", game: params["game"]
      else
        render conn, "login.html", game: params["game"]
      end
    else
      # game doesn't exist
      if user_name && String.length(user_name) > 0 do
        render conn, "game.html", game: params["game"]
      else
        # if not logged in, force log in
        render conn, "login.html", game: params["game"]
      end
    end
  end

  def login(conn, params) do
    render conn, "login.html", game: params["game"]
  end
end
