module SubdomainHelper
  
  $AUTH_TOKEN = '3sNjYej4nv8JFcSyOKqSDpO5ReoZSY3gEx2CQEILCs8'
  
  def scalingo_resources
    {
      subdomain: RestClient::Resource.new("https://api.scalingo.com/v1/apps/angularapp/domains", user:'', password: $AUTH_TOKEN, content_type: :json, accept: :json)                       
    }
  end

  def create_pointer(newsubdomain)
    scalingo_resources[:subdomain].post({domain: {name: "#{newsubdomain.to_s}.unisphere.eu" }}) { |response, request, result, &block|
      send_error('Problem occured while creating subdomain', '500') if response.code != 200
    }
  end
  
end
