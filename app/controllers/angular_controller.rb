class AngularController < ApplicationController
  
  def index
    if is_mobile?
      render :layout => 'mobile'
    elsif request.original_fullpath == "/home" || request.subdomain == "www" || request.subdomain == "dev"
      render :layout => 'home'
    else
      render :layout => 'normalApp'
    end
  end

  def is_mobile?
    (request.user_agent =~ /Mobile|webOS/) && (request.user_agent !~ /iPad/) ? true : false
  end

end
