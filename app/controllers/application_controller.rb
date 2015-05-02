class ApplicationController < ActionController::Base
  
  include AuthenticationHelper
  include ApplicationHelper
  include SubdomainHelper
  
  protect_from_forgery with: :null_session
  before_action :authentication
  
end
