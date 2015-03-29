class ApplicationController < ActionController::Base

  protect_from_forgery with: :null_session
  
  # protect_from_forgery with: :null_session
  #
  # before_action :authenticate_client
  # before_action :authenticate_organization
  # before_action :datas?
  # before_action :read_datas
  # before_action :admin_rights?, only: [:create, :upldate, :destroy]
  # before_action :superadmin_rights?, only: [:index, :archives, :unarchive]
  
end
