class ConnexionsController < ApplicationController
  
  before_action :current_subdomain
  before_action :current_organization
  
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
  
  def create
    ip = request.remote_ip
    if ip != '127.0.0.1' and user_signed_in? and current_subdomain != 'admin' and current_subdomain != 'ifma'
      place_att = Geokit::Geocoders::MultiGeocoder.geocode(request.remote_ip)
      place = "#{place_att.city}::#{place_att.country_code}"
      if @current_organization.connexions.find_by_ip(ip)
        connexion = @current_organization.connexions.find_by_ip(ip)
        Rollbar.info("User active", place: place, email: User.find(params[:user_id]).email)
        connexion.increase_count()
      else
        @current_organization.connexions.create(ip: ip, place: place)
        Rollbar.info("User active", place: place, email: User.find(params[:user_id]).email)
      end
    end
    render json: {response: true}, status: 200
  end
  
end