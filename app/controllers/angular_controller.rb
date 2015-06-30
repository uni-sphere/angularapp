class AngularController < ApplicationController
  
  layout 'webapp'

  def index
    if is_mobile?
      render :layout => 'mobile'
    elsif request.original_fullpath == "/home" || request.subdomain ==  "home"
      render :layout => 'home'
    end
  end

  def is_mobile?
    (request.user_agent =~ /Mobile|webOS/) && (request.user_agent !~ /iPad/) ? true : false
  end

end