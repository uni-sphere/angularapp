class ApplicationController < ActionController::Base

  include AuthenticationHelper
  include ApplicationHelper
  include SubdomainHelper
  
  protect_from_forgery with: :null_session
  
  before_action :authentication
  # before_action :has_admin_rights?, only: [:create, :upldate, :destroy, :index, :archives, :unarchive]
  
end
