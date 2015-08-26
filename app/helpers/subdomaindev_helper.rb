module SubdomaindevHelper

  def dev_scalingo_resources
    {
      subdomain: RestClient::Resource.new("https://api.scalingo.com/v1/apps/angularapp-dev/domains", user:'', password: 'txUZBy-dulhYhnnbn-8wUcEFrAbEePlSt71IcmEin5k', content_type: :json, accept: :json)
    }
  end

  def dev_create_pointer(newsubdomain)
    if Rails.env.production?
      dev_scalingo_resources[:subdomain].post({domain: {name: "#{newsubdomain.to_s}.dev.unisphere.eu" }}) { |response, request, result, &block|
        send_error('Problem occured while creating subdomain', '500') if response.code != 201
      }
    end
  end

  def dev_delete_pointer(subdomain, id)
    unless ['home.dev.unisphere.eu', 'sandbox.dev.unisphere.eu', 'admin.dev.unisphere.eu', 'dev.unisphere.eu', 'apidev.unisphere.eu'].any? { |url| subdomain == url }
      dev_scalingo_resources[:subdomain]["/#{id}"].delete() { |response, request, result, &block|
        if response.code != 204
          return nil
        end
      }
    end
  end

  def dev_reset_pointers
    if Rails.env.production?
      dev_scalingo_resources[:subdomain].get() { |response, request, result, &block|
        if response.code != 200
          send_error('Problem occured while getting subdomain', '500')
        else
          JSON.parse(response).first[1].each do |data|
            dev_delete_pointer(data['name'], data['id'])
          end
          return true
        end
      }
    end
  end

end
