class AngularController < ApplicationController
  
  layout 'main'
  def index
    # if is_mobile?
#       render 'mobile/main'
#     else
#       layout 'main'
#     end
  end
  
  def is_mobile?
    (request.user_agent =~ /Mobile|webOS/) && (request.user_agent !~ /iPad/) ? true : false
  end

end