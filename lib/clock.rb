require 'clockwork'

module Clockwork
  handler do |job|
    puts "Running #{job}"
  end

  every(1.day, 'reset sandbox') {
    `rake sandbox:force_reset_sandbox`
  }

end