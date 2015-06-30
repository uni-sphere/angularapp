module AuthenticationHelper
  
  private
  
  $TOKEN = '6632398822f1d84468ebde3c837338fb'
  
  def authentication
    # authenticate_client unless request.path == '/'
  end
  
  def authenticate_client
    # authenticate_with_http_token do |token, options|
    #   send_error('Bad token', 401) unless token == $TOKEN
    # end
  end
  
  def current_subdomain
    if Rails.env.production?
      if URI.parse(request.env['HTTP_ORIGIN']).host.include? 'home' or URI.parse(request.env['HTTP_ORIGIN']).host.include? 'dev'
        return 'sandbox'
      else
        uri = URI.parse(request.env['HTTP_ORIGIN']).host
        return uri.split('.').first
      end
    else
      return 'sandbox'
    end
  end
  
  def current_organization
    if Rails.env.production?
      subdomain = current_subdomain
      if Organization.exists?(subdomain: subdomain)
        organization = Organization.find_by(subdomain: subdomain)
        return organization
      else
        send_error('organization not found', 404)
      end
    else
      return Organization.first
    end
  end
  
  def current_awsdocument
    if Awsdocument.exists? params[:id]
      @awsdocument = Awsdocument.find_unarchived params[:id]
    else
      send_error('resource not found', 404)
    end
  end
  
  def current_node
    params[:node_id] = params[:id] if request.url.split('?').first.include? 'node'
    if params[:node_id]
      if current_organization.nodes.exists? params[:node_id]
        return current_organization.nodes.find params[:node_id]
      else
        send_error('node not found', 404)
      end
    else
      send_error('node id not received', 400)
    end
  end
  
  def user_nodes
    if Chapter.exists?(user_id: current_user.id)
      chapters = Chapter.where(user_id: current_user.id)
      ids = []
      chapters.each do |chapter|
        ids << chapter.node_id if Chapter.where(node_id: chapter.node_id).count > 1 || chapter.awsdocuments.count > 0
      end
      if Node.exists?(id: ids)
        return Node.where(id: ids)
      else
        return {}
      end
    else
      return {}
    end
  end

  def current_chapter
    params[:chapter_id] = params[:id] if request.url.split('?').first.include? 'chapter'
    if params[:chapter_id]
      if current_node.chapters.exists? params[:chapter_id]
        return current_node.chapters.find params[:chapter_id]
      elsif params[:chapter_id] == '0'
        return current_node.chapters.first
      else
        send_error('chapter not found', 404)
      end
    else
      send_error('chapter id not received', 400)
    end
  end
  
  def track_connexion
    ip = request.remote_ip
    if request.path != '/' and ip != '127.0.0.1' and ip != '88.169.99.128' and current_subdomain != 'admin'
      place_att = Geokit::Geocoders::MultiGeocoder.geocode(request.remote_ip)
      place = "#{place_att.city}::#{place_att.country_code}"
      Rollbar.info("User active", place: place)
      if current_organization.connexions.find_by_ip(ip)
        connexion = current_organization.connexions.find_by_ip(ip)
        if Time.now - connexion.updated_at > 30.minutes
          connexion.increase_count()
        elsif Time.now - connexion.updated_at > 15.seconds
          connexion.activity()
        end
      else
        current_organization.connexions.create(ip: ip, place: place)
      end
    end
  end

end  





