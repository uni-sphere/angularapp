require 'clockwork'

module Clockwork
  handler do |job|
    puts "Running #{job}"
  end
  
  every(7.days, 'activity reports') {
    `rake activity_reports:send`
  }
  
  every(6.days, 'awsdocument links') {
    `rake awsdocuments_links:refresh`
  }

end