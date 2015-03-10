class AngularController < ApplicationController

  def index
    render layout: layout_name
    # render json: {name: {["1- Algèbre", "name": "2- Matrice", "name": "3- Polynome", "name": "4- Géométrie"]}}.to_json
  end


  private

  def layout_name
    if params[:layout] == 0
      false
    else
      'application'
    end
  end
end