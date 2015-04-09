CarrierWave.configure do |config|
  config.storage = :fog
  config.fog_credentials = {
    provider:              'AWS',                        
    aws_access_key_id:     'AKIAIHURXGDEFIFZNGEQ',                       
    aws_secret_access_key: '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',
    endpoint:              "https://s3-eu-central-1.amazonaws.com",
    region:                'eu-central-1'
  }
  config.fog_directory  = 'unisphere'                             
  config.fog_public     = false
  config.fog_authenticated_url_expiration = 5.years
end
