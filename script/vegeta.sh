echo "GET   " | vegeta attack -rate 20 -duration=60s | tee results.bin | vegeta report;
rm results.bin
