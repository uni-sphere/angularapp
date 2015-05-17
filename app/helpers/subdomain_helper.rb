module SubdomainHelper
  
  $AUTH_TOKEN = '3sNjYej4nv8JFcSyOKqSDpO5ReoZSY3gEx2CQEILCs8'
  
  def scalingo_resources
    {
      subdomain: RestClient::Resource.new("https://api.scalingo.com/v1/apps/angularapp/domains", user:'', password: $AUTH_TOKEN, content_type: :json, accept: :json)                       
    }
  end

  def create_pointer(newsubdomain)
    if Rails.env.production?
      scalingo_resources[:subdomain].post({domain: {name: "#{newsubdomain.to_s}.unisphere.eu" }}) { |response, request, result, &block|
        if response.code != 201
          send_error('Problem occured while creating subdomain', '500') 
        else
          return true
        end
      }
    end
  end
  
  def delete_pointer(subdomain, id)
    unless ['api.unisphere.eu', 'home.unisphere.eu', 'sandbox.unisphere.eu'].any? { |url| subdomain == url }
      scalingo_resources[:subdomain]["/#{id}"].delete() { |response, request, result, &block|
        if response.code != 204
          return nil
        end
      }
    end
  end
  
  def reset_pointers
    if Rails.env.production?
      scalingo_resources[:subdomain].get() { |response, request, result, &block|
        if response.code != 200
          send_error('Problem occured while getting subdomain', '500') 
        else
          JSON.parse(response).first[1].each do |data|
            delete_pointer(data['name'], data['id'])
          end
          return true
        end
      }
    end
  end
  
end
