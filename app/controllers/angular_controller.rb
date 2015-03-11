class AngularController < ApplicationController

  def index
    # render layout: layout_name
  end

  def show
    render json: {
      chapters: [{name: '1- Algèbre'}, {name: '2- Matrice'}]
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