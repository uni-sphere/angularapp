module AuthenticationHelper

  def user_nodes_email(id)
    if Chapter.where(archived: false).exists?(user_id: id)
      chapters = Chapter.where(user_id: id, archived: false)
      ids = []
      chapters.each do |chapter|
        ids << chapter.node_id if Chapter.where(node_id: chapter.node_id, archived: false).count > 1 || chapter.awsdocuments.count > 0
      end
      if Node.where(archived: false).exists?(id: ids)
        return Node.where(id: ids, archived: false)
      else
        return {}
      end
    else
      return {}
    end
  end

  private

  def dev?
    if URI.parse(request.env['HTTP_ORIGIN']).host.include? 'dev.'
      return true
    else
      return false
    end
  end

  def user_documents
    ids = []
    current_user.chapters.where(archived: false).each do |chapter|
      chapter.awsdocuments.each do |awsdocument|
        ids << awsdocument.id
      end
    end
    return Awsdocument.where(id: ids, archived: false)
  end

  def authenticate_client
    if request.path == '/'
      authenticate_with_http_token do |token, options|
        send_error('Unauthorized', 401) unless token == ENV["TOKEN_BASED_AUTH"]
      end
    end
  end

  def current_subdomain
    if Rails.env.production?
      if URI.parse(request.env['HTTP_ORIGIN']).host == 'www.unisphere.eu'|| URI.parse(request.env['HTTP_ORIGIN']).host == 'dev.unisphere.eu'
        logger.info '-------------'
        logger.info request.subdomain
        logger.info '-------------'
        @current_subdomain = 'sandbox'
      else
        uri = URI.parse(request.env['HTTP_ORIGIN']).host
        @current_subdomain = uri.split('.').first
      end
    else
      @current_subdomain = 'sandbox'
    end
  end

  def current_organization
    if Rails.env.production?
      if Organization.exists?(subdomain: @current_subdomain)
        @current_organization = Organization.where(subdomain: @current_subdomain).first
      else
        send_error('organization not found', 404)
      end
    else
      @current_organization = Organization.find_by_subdomain 'sandbox'
    end
  end

  def current_awsdocument
    if Awsdocument.exists? params[:id]
      @current_awsdocument = Awsdocument.find_unarchived params[:id]
    else
      send_error('resource not found', 404)
    end
  end

  def current_node
    params[:node_id] = params[:id] if request.url.split('?').first.include? 'node'
    if params[:node_id]
      if @current_organization.nodes.where(archived: false).exists? params[:node_id]
        @current_node = @current_organization.nodes.find params[:node_id]
      else
        send_error('node not found', 404)
      end
    else
      send_error('node id not received', 400)
    end
  end

  def user_nodes
    if Chapter.exists?(user_id: current_user.id, archived: false)
      chapters = current_user.chapters.where(archived: false)
      ids = []
      chapters.each do |chapter|
        ids << chapter.node_id if Chapter.where(node_id: chapter.node_id, archived: false).count > 1 || chapter.awsdocuments.count > 0
      end
      if Node.exists?(id: ids, archived: false)
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
      if @current_node.chapters.where(archived: false).exists? params[:chapter_id]
        @current_chapter = @current_node.chapters.where(archived: false).find params[:chapter_id]
      elsif params[:chapter_id] == '0'
        @current_chapter = @current_node.chapters.where(archived: false).first
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
      if @current_organization.connexions.find_by_ip(ip)
        connexion = @current_organization.connexions.find_by_ip(ip)
        if Time.now - connexion.updated_at > 30.minutes
          Rollbar.info("User active", place: place)
          connexion.increase_count()
        elsif Time.now - connexion.updated_at > 15.seconds
          connexion.activity()
        end
      else
        @current_organization.connexions.create(ip: ip, place: place)
      end
    end
  end

end





