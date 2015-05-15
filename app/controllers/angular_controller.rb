class AngularController < ApplicationController

  layout 'main'
  
  def index
    render 'mobile/main' if is_mobile?
  end
  
  def is_mobile?
    (request.user_agent =~ /Mobile|webOS/) && (request.user_agent !~ /iPad/) ? true : false
  end

end