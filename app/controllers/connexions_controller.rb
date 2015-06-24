class ConnexionsController < ApplicationController
  
  def index
    activity = {}
    Organization.all.each do |organization|
      active_connexions = organization.connexions.where("updated_at >= ?", DateTime.now - 5.minutes)
      top_co = organization.connexions.order(:count).limit(5)
      awsdocuments = organization.awsdocuments.count
      users = organization.users.count
      activity[organization.subdomain] = [active_connexions.count, awsdocuments, users, top_co]
    end
    render json: {activity: activity}, status: 200
  end
  
end