class AngularController < ApplicationController

  def index
    if is_mobile?
      redirect_to "http://unisphere.eu"
    else
      render :layout => 'normalApp'
    end
  end

  def is_mobile?
    (request.user_agent =~ /Mobile|webOS/) && (request.user_agent !~ /iPad/) ? true : false
  end

end
