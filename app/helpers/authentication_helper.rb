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

  def is_sandbox?
    if current_subdomain === 'sandbox' and !request.env['HTTP_ORIGIN'].include? 'localhost:3000'
      return true
    else
      return false
    end
  end
  
  def is_localhost?
    if request.env['HTTP_REFERER'].include? 'localhost:3000'
      return true
    else
      return false
    end
  end

  def dev?
    if URI.parse(URI.encode(request.env['HTTP_ORIGIN'])).host.include? 'dev.'
      return true
    else
      return false
    end
  end

  def user_nodes
    if Chapter.exists?(user_id: current_user.id, archived: false)
      chapters = current_user.chapters.where(archived: false)
      ids = []
      chapters.each do |chapter|
        ids << chapter.node_id if Chapter.where(node_id: chapter.node_id, archived: false).count > 1 || chapter.awsdocuments.where(archived: false).count > 0
      end
      if Node.exists?(id: ids, archived: false)
        res = []
        Node.where(id: ids, archived: false, organization_id: current_organization.id).each do |node|
          res << {parent_name: Node.find(node.parent_id).name, name: node.name, id: node.id} if node.user_id == current_user.id
        end
        return res.to_json
      else
        return {}
      end
    else
      return {}
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
        send_error('Unauthorized', 401) unless token == ENV["TOKEN_BASED_AUTHc"]
      end
    end
  end

  def track_connexion
    ip = request.remote_ip
    if request.path != '/' and ip != '127.0.0.1' and ip != '88.169.99.128' and current_subdomain != 'admin' and user_signed_in?
      place_att = Geokit::Geocoders::MultiGeocoder.geocode(request.remote_ip)
      place = "#{place_att.city}::#{place_att.country_code}"
      if current_organization.connexions.find_by_ip(ip)
        connexion = current_organization.connexions.find_by_ip(ip)
        sleep 2
        if Time.now - connexion.updated_at > 30.minutes
          Rollbar.info("User active", place: place, email: current_user.email)
          connexion.increase_count()
        elsif Time.now - connexion.updated_at > 15.seconds
          connexion.activity()
        end
      else
        current_organization.connexions.create(ip: ip, place: place)
      end
    end
  end

  def current_subdomain
    if Rails.env.production?
      if URI.parse(URI.encode(request.env['HTTP_ORIGIN'])).host == 'www.unisphere.eu'|| URI.parse(URI.encode(request.env['HTTP_ORIGIN'])).host == 'dev.unisphere.eu'
        @current_subdomain ||= 'sandbox'
      else
        uri = URI.parse(request.env['HTTP_ORIGIN']).host
        if uri.include? 'www'
          @current_subdomain ||= uri.split('.')[1]
        else
          @current_subdomain ||= uri.split('.').first
        end
      end
    else
      @current_subdomain ||= 'sandbox'
    end
  end

  def current_organization
    if Rails.env.production?
      @current_organization ||= Organization.find_by_subdomain current_subdomain
    else
      @current_organization ||= Organization.find_by_subdomain 'sandbox'
    end
  end

  def current_awsdocument
    @current_awsdocument ||= Awsdocument.find_unarchived params[:id]
  end

  def current_node
    params[:node_id] = params[:id] if request.url.split('?').first.include? 'node'
    @current_node ||= current_organization.nodes.where(id: params[:node_id], archived: false).first
  end

  def current_chapter
    params[:chapter_id] = params[:id] if request.url.split('?').first.include? 'chapter'
    if params[:chapter_id] == '0'
      @current_chapter ||= current_node.chapters.where(archived: false).first
    else
      @current_chapter ||= current_node.chapters.where(archived: false).find params[:chapter_id]
    end
  end

  def send_404
    render json: {error: 'Object not found'}.to_json, status:404
  end

end






