class AngularController < ApplicationController

  def index
    # render nothing: true
    # render layout: layout_name
    # render json: {name: 'crotte'}.to_json
  end

  def show
    render json: {name: "hello"}.to_json
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