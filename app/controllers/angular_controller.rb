class AngularController < ApplicationController

  layout 'main'

  def index
    if is_mobile?
      render :layout => 'mobile'
    end
  end

  def is_mobile?
    (request.user_agent =~ /Mobile|webOS/) && (request.user_agent !~ /iPad/) ? true : false
  end

end