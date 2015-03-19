class AngularController < ApplicationController

  def index
    # render layout: layout_name
  end

  def show
    render json: {
      chapters: [{name: '1- Algèbre'}, {name: '2- Matrice'}]
    }.to_json
  end

  def nodes
    render json:
    {
      name: "Lycée Freppel",
      children: 
      [
        {
          name: "1 ère",
          children: [
            {name: "1d"},
            {name: "23"},
            {name: "33"},
            {name: "34"},
            {name: "35"},
            {name: "37"}
          ]
        },
        {
          name: "2 nd",
          children: [
            {name: "1"},
            {name: "1"},
            {name: "3"}
          ]
        }
      ]
    }.to_json
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