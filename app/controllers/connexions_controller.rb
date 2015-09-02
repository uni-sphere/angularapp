class ConnexionsController < ApplicationController
  
  def index
    activity = {}
    Organization.all.each do |organization|
      active_connexions = organization.connexions.where("updated_at >= ?", Time.now - 2.minutes)
      top_co = organization.connexions.order(count: :desc).limit(5)
      awsdocuments = organization.awsdocuments.where(archived: false).count
      users = organization.users.count
      @downloads = 0
      organization.nodes.each do |node|
        node.reports.each do |report|
          @downloads += report.downloads
        end
      end 
      activity[organization.subdomain] = [active_connexions.count, awsdocuments, @downloads, users, top_co]
    end
    render json: {activity: activity}, status: 200
  end
  
end