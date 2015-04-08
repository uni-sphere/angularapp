class AngularController < ApplicationController
  
  def index
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