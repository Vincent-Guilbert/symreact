<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ApiResource(
 *  normalizationContext={
 *      "groups"={"invoices_read"}
 *  },
 *  attributes={
 *      "pagination_enabled"=false,
 *      "pagination_items_per_page"=20,
 *      "order"={"sentAt":"desc"}
 *  },
 *  subresourceOperations={
 *      "api_customers_invoices_get_subresource"={
 *          "normalization_context"={"groups"={"invoices_subresource"}}
 *      }
 *  },
 *  itemOperations={"GET", "DELETE", "PUT", "PATCH", "increment"={
 *      "method"="post",
 *      "path"="/invoices/{id}/increment",
 *      "controller"="App\Controller\InvoiceIncrementationController"
 *      }
 *  }
 * )
 * @ApiFilter(OrderFilter::class, properties={"amount", "sentAt"})
 */
class Invoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @ORM\Column(type="float")
     * @Assert\NotBlank(message="Le montant est obligatoire.")
     * @Assert\Type(type="numeric", message="le monant doit être de type numérique.")
     */
    private $amount;

    /**
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @ORM\Column(type="datetime")
     * @Assert\Type(type="dateTime", message="La date doit ête au format YYYY-MM-DD.")
     * @Assert\NotBlank(message="La date doit être renseignée.")
     */
    private $sentAt;

    /**
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @ORM\Column(type="string", length=25)
     * @Assert\NotBlank(message="Le statut est obligatoire.")
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"}, message="Le statut doit être SENT, PAID ou CANCELLED.")
     */
    private $status;

    /**
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @ORM\Column(type="integer")
     * @Assert\NotBlank(message="le chrono de la facture est obligatoire.")
     * @Assert\Type(type="integer", message="Le chrono doit être de type numérique.")
     */
    private $chrono;

    /**
     * @Groups({"invoices_read"})
     * @ORM\JoinColumn(nullable=false)
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @Assert\NotBlank(message="Le client de la facture doit être renseigné.")
     */
    private $customer;

    public function __construct()
    {
        $this->setSentAt(new \DateTime);
    }

    /**
     * @Groups({"invoices_read", "invoices_subresource"})
     */
    public function getUser(): User
    {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(\DateTimeInterface $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
