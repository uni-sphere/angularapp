class ConnexionsController < ApplicationController
  
  def index
    activity = {}
    Organization.all.each do |organization|
      active_connexions = organization.connexions.where("updated_at >= ?", Time.now - 2.minutes)
      top_co = organization.connexions.order(count: :desc).limit(5)
      awsdocuments = organization.awsdocuments.where(archived: false).count
      users = organization.users.count
      activity[organization.subdomain] = [active_connexions.count, awsdocuments, users, top_co]
    end
    render json: {activity: activity}, status: 200
  end
  
end